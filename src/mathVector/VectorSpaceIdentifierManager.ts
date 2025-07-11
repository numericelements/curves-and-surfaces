import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";

/**
 * Vector Space Identifier Manager - Singleton for generating unique IDs
 */
export class VectorSpaceIdentifierManager {
    private static instance: VectorSpaceIdentifierManager;
    private nextId: number = 1;
    private readonly defaultSpaceIds: Map<string, string> = new Map();

    private constructor() {}

    static getInstance(): VectorSpaceIdentifierManager {
        if (!VectorSpaceIdentifierManager.instance) {
            VectorSpaceIdentifierManager.instance = new VectorSpaceIdentifierManager();
        }
        return VectorSpaceIdentifierManager.instance;
    }

    /**
     * Generate a unique identifier for a vector space
     */
    generateId(): string {
        return `vs_${this.nextId++}_${Date.now()}`;
    }

    /**
     * Get or create default space identifier for a given type and dimension
     */
    getDefaultSpaceId(spaceType: VectorSpaceType, dimension: number): string {
        const key = `${spaceType}_${dimension}`;
        if (!this.defaultSpaceIds.has(key)) {
            this.defaultSpaceIds.set(key, `default_${key}_${this.generateId()}`);
        }
        return this.defaultSpaceIds.get(key)!;
    }

    /**
     * Check if an ID represents a default space
     */
    isDefaultSpace(id: string): boolean {
        return id.startsWith('default_');
    }
}