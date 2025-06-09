export interface ComponentType {
    readonly children?: React.ReactNode;
}

export interface BaseUI extends ComponentType {
    className?: string;
}

export enum TextFirstButtons {
    textFirst = 'textFirst',
}

export enum IconFirstButtons {
    iconFirst = 'iconFirst',
    load = 'load',
}

export type ButtonClassType =
    | 'textFirst'
    | 'iconFirst'
    | 'load';

export interface ButtonConfig {
    variant?: ButtonClassType;
    text?: string;
    href?: string;
    isBlank?: boolean;
    submit?: boolean;
    isLightBg?: boolean;
    disabled?: boolean;
    isStartButton?: boolean;
    clickHandler?: () => void;
}

