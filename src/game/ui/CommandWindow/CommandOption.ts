export type CommandOption = {
    description: string;
    value: string;
    onSelect: () => void | Promise<void>;
    disabled: boolean;
}