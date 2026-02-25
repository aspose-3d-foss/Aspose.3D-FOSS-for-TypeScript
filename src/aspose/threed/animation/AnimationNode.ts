import { A3DObject } from '../A3DObject';
import { PropertyCollection } from '../PropertyCollection';
import { BindPoint } from './BindPoint';
import { KeyframeSequence } from './KeyframeSequence';
import { A3DObject as A3DObjectClass } from '../A3DObject';
import { Property } from '../Property';

export class AnimationNode extends A3DObject {
    private _bindPoints: BindPoint[] = [];
    private _subAnimations: AnimationNode[] = [];

    constructor(name: string = null) {
        super(name);
    }

    findBindPoint(target: A3DObjectClass, name: string): BindPoint {
        for (const bp of this._bindPoints) {
            if (bp.property.name === name) {
                return bp;
            }
        }
        return null;
    }

    getBindPoint(target: A3DObjectClass, propName: string, create: boolean): BindPoint {
        const prop = target.findProperty(propName);
        if (prop) {
            const bp = this.findBindPoint(target, propName);
            if (bp === null && create) {
                bp = new BindPoint(prop.scene, prop);
                this._bindPoints.push(bp);
            }
            return bp;
        }
        return null;
    }

    createBindPoint(obj: A3DObjectClass, propName: string): BindPoint {
        const prop = obj.findProperty(propName);
        if (prop) {
            const bp = new BindPoint(prop.scene, prop);
            this._bindPoints.push(bp);
            return bp;
        }
        return null;
    }

    getKeyframeSequence(target: A3DObjectClass, propName: string, channelName: string = null, create: boolean = true): KeyframeSequence {
        const bp = this.getBindPoint(target, propName, create);
        if (bp === null) {
            return null;
        }

        if (channelName) {
            const channel = bp.getChannel(channelName);
            if (channel) {
                const seq = channel.keyframeSequence;
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
