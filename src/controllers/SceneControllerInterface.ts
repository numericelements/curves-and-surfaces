

export interface SceneControllerInterface {

    /**
     * 
     * @param ndcX Normal device coordinate x
     * @param ndcY Normal device coordinate y
     */
    leftMouseDown_event(ndcX: number, ndcY: number): void

    leftMouseUp_event(): void

    /**
     * 
     * @param ndcX Normal device coordinate x
     * @param ndcY Normal device coordinate y
     */
    leftMouseDragged_event(ndcX: number, ndcY: number): void

}