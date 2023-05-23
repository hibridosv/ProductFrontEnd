import { textPresets, iconPresets, stylePresets } from "./button-presets";


export enum Preset {
    primary = "primary",
    danger = "danger",
    close = "close",
    cancel = "cancel",
    save = "save",
    accept = "accept",
    send = "send",
  }
  
  export interface ButtonProps {
    preset?: Preset;
    text?: string;
    style?: string;
    onClick?: () => void;
    isFull?: boolean;
    type?: any;
  }
  
  export function Button(props: ButtonProps) {
    const { preset = Preset.primary, text, onClick, style, isFull = false, type= "button" } = props;
  

    const textStyle = stylePresets[preset] || stylePresets.primary;
    const full = isFull ? "w-full" : null;
    const textStyles = `${textStyle} ${style} ${full}`;
    const icon = iconPresets[preset] || iconPresets.primary;
    const buttonText = text ? text : textPresets[preset] || "Button"
  
    return (
      <button type={type} className={textStyles} onClick={onClick}>
       {icon} {buttonText}
      </button>
    );
  }
  