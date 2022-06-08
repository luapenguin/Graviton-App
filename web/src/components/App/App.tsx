import { useEffect } from "react";
import { createClient } from "../../services/client";
import {
  clientState,
  panelsState,
  prompts,
} from "../../utils/state";
import {
  RecoilRoot,
  useSetRecoilState,
} from "recoil";
import RecoilNexus from "recoil-nexus";
import Panels from "./PanelsView";
import Tabs from "./TabsView";
import Theme from "../Providers/ThemeProvider";
import { SplitPane } from "react-multi-split-pane";
import { isTauri } from "../../services/commands";
import ExplorerPanel from "../../panels/explorer";
import StatusBarView from "./StatusBarView";
import GlobalPrompt from "../../prompts/global";
import TitleBar from "./TitleBar";
import ContextMenuView from "./ContextMenuView";
import WindowsView from "./WindowsView";
import { RootView } from "./RootView";

/*
 * Retrieve the authentication token
 */
async function getToken() {
  if (isTauri) {
    return "graviton_token";
  } else {
    // Or query the URL to get the token
    return new URL(location.toString()).searchParams.get("token");
  }
}

/**
 * Handles the connection client
 */
function ClientRoot() {
  const setClient = useSetRecoilState(clientState);
  const setPanels = useSetRecoilState(panelsState);
  const setPrompts = useSetRecoilState(prompts);

  useEffect(() => {
    // Retrieve the token and then create a new client
    getToken().then(async (token) => {
      if (token !== null) {
        const client = await createClient(token);

        // Wait until it's connected
        client.whenConnected().then(() => {
          setClient(client);
          setPanels([
            {
              panel: new ExplorerPanel(),
            },
          ]);
          setPrompts((val) => [...val, GlobalPrompt]);
        });
      }
    });
  }, []);

  return null;
}



function App() {
  const isWindows = window.navigator.platform === "Win32";

  return (
    <RecoilRoot>
      <ClientRoot />
      <RecoilNexus />
      <Theme>
        <RootView isWindows={isWindows}>
          {isWindows && <TitleBar />}
          <div>
            <SplitPane split="vertical" minSize={250} defaultSizes={[2, 10]}>
              <Panels />
              <Tabs />
            </SplitPane>
          </div>
          <WindowsView />
          <ContextMenuView />
          <StatusBarView />
        </RootView>
      </Theme>
    </RecoilRoot>
  );
}

export default App;
