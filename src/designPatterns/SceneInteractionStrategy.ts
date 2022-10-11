
export interface SceneInteractionStrategy {

    processLeftMouseDownInteraction(ndcX: number, ndcY: number): void;

    processLeftMouseDragInteraction(ndcX: number, ndcY: number): void;

    processLeftMouseUpInteraction(): void;

    processShiftKeyDownInteraction(): void;

    processShiftKeyUpInteraction(): void;

}