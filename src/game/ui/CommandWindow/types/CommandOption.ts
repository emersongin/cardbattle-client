export type CommandOption = {
    description: string;
    disabled?: boolean;
    onSelect: () => Promise<void> | void;
}