export type CommandOption = {
    description: string;
    disabled: boolean;
    onSelect: () => void | Promise<void>;
}