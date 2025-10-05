export type CommandOption<T> = {
    description: string;
    onSelect: () => Promise<T | void> | T | void;
    disabled: boolean;
}