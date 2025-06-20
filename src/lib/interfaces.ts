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
    isPaddingLarge?: boolean;
    isStartButton?: boolean;
    ifFullWidth?: boolean;
    clickHandler?: () => void;
}

export interface LabelType {
    label: string;
}

export enum IconType {
    ThumbsUp = 'thumbsUp',
    Flag = 'flag',
}

export interface MultiSectionFormData {
    asFormTitle: string;
    commonInfoSection: {
        childInfoTitle: string;
        childName: LabelType;
        birthDate: LabelType & {
            placeholder: string;
            minDate: string;
        };
        gender: LabelType & {
            options: string[];
        };
        parentName: LabelType;
    };
    rulesSection: {
        rulesTitle: string;
        rules: {
            iconType: IconType;
            text: string;
        }[];
    };
    radioSections: {
        title: string;
        questions: string[];
    }[];
    commonQuestions: {
        title: string;
        radioQuestion: string;
        freeQuestions: (string | { text: string; isSmallArea: boolean; })[];
    };
}
