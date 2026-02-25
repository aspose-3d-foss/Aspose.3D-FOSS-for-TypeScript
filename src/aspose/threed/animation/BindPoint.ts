import { A3DObject } from '../A3DObject';
import { PropertyCollection } from '../PropertyCollection';
import { Scene } from '../Scene';
import { Property } from '../Property';
import { AnimationChannel } from './AnimationChannel';
import { KeyframeSequence } from './KeyframeSequence';

export class BindPoint extends A3DObject {
    private _scene: Scene;
    private _property: Property;
    private _channels: AnimationChannel[] = [];

    constructor(scene: Scene, prop: Property) {
        super();
        this._scene = scene;
        this._property = prop;
    }

    addChannel(name: string, value: any, type?: any): boolean {
        const channel = new AnimationChannel(name);
        channel.defaultValue = value;
        this._channels.push(channel);
        return true;
    }

    getKeyframeSequence(channelName: string): KeyframeSequence {
        for (const channel of this._channels) {
            if (channel.name === channelName && channel.keyframeSequence) {
                return channel.keyframeSequence;
            }
        }
        return null;
    }

    createKeyframeSequence(name: string): KeyframeSequence {
        const seq = new KeyframeSequence(name);
        seq.bindPoint = this;
        return seq;
    }

    bindKeyframeSequence(channelName: string, sequence: KeyframeSequence): void {
        for (const channel of this._channels) {
            if (channel.name === channelName) {
                channel.keyframeSequence = sequence;
                if (sequence) {
                    sequence.bindPoint = this;
                }
                break;
            }
        }
    }

    getChannel(channelName: string): AnimationChannel {
        for (const channel of this._channels) {
            if (channel.name === channelName) {
                return channel;
            }
        }
        return null;
    }

    resetChannels(): void {
        this._channels = [];
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

    get property(): Property {
        return this._property;
    }

    get channelsCount(): number {
        return this._channels.length;
    }
}
