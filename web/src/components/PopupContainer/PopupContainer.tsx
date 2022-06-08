import { WindowButton } from "../Primitive/Button";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { TranslatedText } from "../../types/types";
import { showedWindowsState } from "../../utils/state";
import WindowBackground from "../Window/WindowBackground";

const StyledPopup = styled.div<{ height: number }>`
  user-select: none;
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  & .popup {
    padding: 25px;
    border: 1px solid ${({ theme }) => theme.elements.prompt.container.border};
    width: 300px;
    border-radius: 10px;
    height: ${({ height }) => `${height}px`};
    background: ${({ theme }) => theme.elements.prompt.container.background};
    color: white;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15);
    overflow: auto;
  }
  & h5 {
    margin-top: 0px;
  }
  & p {
    font-size: 14px;
    margin: 5px 0px 18px 0px;
  }
`;

export interface PopupButtonOptions {
  label: string;
  action: () => void;
}
interface PopupOptions {
  title: TranslatedText;
  content: TranslatedText;
  buttons: PopupButtonOptions[];
  height: number;
}

export default function PopupContainer({
  title,
  content,
  buttons,
  height,
}: PopupOptions) {
  const { t } = useTranslation();
  const refBackground = useRef(null);
  const setShowedWindows = useSetRecoilState(showedWindowsState);

  function closePopup() {
    setShowedWindows((val) => {
      const newValue = [...val];
      newValue.pop();
      return newValue;
    });
  }

  function closePopupOnClick(event: any) {
    if (event.target === refBackground.current) {
      closePopup();
    }
  }

  return (
    <>
      <WindowBackground />
      <StyledPopup
        onClick={closePopupOnClick}
        ref={refBackground}
        height={height}
      >
        <div className="popup">
          <h5>{t(title.text, title.props)}</h5>
          <p>{t(content.text, title.props)}</p>
          <div>
            {buttons.map(({ label, action }, i) => {
              const buttonAction = () => {
                action();
                closePopup();
              };
              return (
                <WindowButton expanded={true} key={i} onClick={buttonAction}>
                  {t(label)}
                </WindowButton>
              );
            })}
          </div>
        </div>
      </StyledPopup>
    </>
  );
}
