export type OpenWindowConfig = {
    onComplete?: () => Promise<void> | void;
    onClose?: () => void;
};
