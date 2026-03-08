import { A3DObject } from '../A3DObject';
import { PropertyCollection } from '../PropertyCollection';
import { BindPoint } from './BindPoint';
import { KeyframeSequence } from './KeyframeSequence';
import { A3DObject as A3DObjectClass } from '../A3DObject';

export class AnimationNode extends A3DObject {
    private _bindPoints: BindPoint[] = [];
    private _subAnimations: AnimationNode[] = [];

    constructor(name: string | null = null) {
        super(name ?? undefined);
    }

    findBindPoint(_target: A3DObjectClass, name: string): BindPoint | null {
        for (const bp of this._bindPoints) {
            if (bp.property.name === name) {
                return bp;
            }
        }
        return null;
    }

    getBindPoint(target: A3DObjectClass, propName: string, create: boolean): BindPoint | null {
        const prop = target.findProperty(propName);
        if (prop) {
            let bp = this.findBindPoint(target, propName);
            if (bp === null && create) {
                bp = new BindPoint(null, prop);
                this._bindPoints.push(bp);
            }
            return bp;
        }
        return null;
    }

    createBindPoint(obj: A3DObjectClass, propName: string): BindPoint | null {
        const prop = obj.findProperty(propName);
        if (prop) {
            const bp = new BindPoint(null, prop);
            this._bindPoints.push(bp);
            return bp;
        }
        return null;
    }

    getKeyframeSequence(target: A3DObjectClass, propName: string, channelName: string | null = null, create: boolean = true): KeyframeSequence | null {
        const bp = this.getBindPoint(target, propName, create);
        if (bp === null) {
            return null;
        }

        if (channelName) {
            const channel = bp.getChannel(channelName);
            if (channel) {
                let seq = channel.keyframeSequence;
                if (seq === null && create) {
                    seq = bp.createKeyframeSequence(channelName);
                    channel.keyframeSequence = seq;
                }
                return seq;
            } else if (create) {
                const seq = bp.createKeyframeSequence(channelName);
                bp.bindKeyframeSequence(channelName, seq);
                return seq;
            }
        } else {
            return bp.createKeyframeSequence(propName);
        }

        return null;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get properties(): PropertyCollection {
        return this._properties;
    }

    get bindPoints(): BindPoint[] {
        return [...this._bindPoints];
    }

    get subAnimations(): AnimationNode[] {
        return [...this._subAnimations];
    }
}
