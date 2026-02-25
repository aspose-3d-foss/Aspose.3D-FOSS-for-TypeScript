import { Vector2 } from './Vector2';
import { Vector3 } from './Vector3';

export class MathUtils {
    static toDegree(radian: Vector3): Vector3;
    static toDegree(radian: number): number;
    static toDegree(x: number, y: number, z: number): Vector3;
    static toDegree(...args: any[]): any {
        if (args.length === 1 && args[0] instanceof Vector3) {
            return new Vector3(
                (args[0].x * 180.0) / Math.PI,
                (args[0].y * 180.0) / Math.PI,
                (args[0].z * 180.0) / Math.PI
            );
        } else if (args.length === 1) {
            return (Number(args[0]) * 180.0) / Math.PI;
        } else if (args.length === 3) {
            return new Vector3(
                (Number(args[0]) * 180.0) / Math.PI,
                (Number(args[1]) * 180.0) / Math.PI,
                (Number(args[2]) * 180.0) / Math.PI
            );
        }
    }

    static toRadian(degree: Vector3): Vector3;
    static toRadian(degree: number): number;
    static toRadian(x: number, y: number, z: number): Vector3;
    static toRadian(...args: any[]): any {
        if (args.length === 1 && args[0] instanceof Vector3) {
            return new Vector3(
                (args[0].x * Math.PI) / 180.0,
                (args[0].y * Math.PI) / 180.0,
                (args[0].z * Math.PI) / 180.0
            );
        } else if (args.length === 1) {
            return (Number(args[0]) * Math.PI) / 180.0;
        } else if (args.length === 3) {
            return new Vector3(
                (Number(args[0]) * Math.PI) / 180.0,
                (Number(args[1]) * Math.PI) / 180.0,
                (Number(args[2]) * Math.PI) / 180.0
            );
        }
    }

    static calcNormal(points: Vector3[]): Vector3 {
        if (points.length < 3) {
            return new Vector3(0, 0, 1);
        }

        let nx = 0.0, ny = 0.0, nz = 0.0;

        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];

            nx += (p1.y - p2.y) * (p1.z + p2.z);
            ny += (p1.z - p2.z) * (p1.x + p2.x);
            nz += (p1.x - p2.x) * (p1.y + p2.y);
        }

        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
        if (len < 1e-10) {
            return new Vector3(0, 0, 1);
        }

        return new Vector3(nx / len, ny / len, nz / len);
    }

    static findIntersection(p0: Vector2, d0: Vector2, p1: Vector2, d1: Vector2, results: Vector2[]): number {
        const det = d0.x * d1.y - d0.y * d1.x;

        if (Math.abs(det) < 1e-10) {
            const diff = new Vector2(p1.x - p0.x, p1.y - p0.y);
            const cross = diff.x * d0.y - diff.y * d0.x;

            if (Math.abs(cross) < 1e-10) {
                return 2;
            }
            return 0;
        }

        const t = ((p1.x - p0.x) * d1.y - (p1.y - p0.y) * d1.x) / det;

        const result = new Vector2(p0.x + t * d0.x, p0.y + t * d0.y);
        results[0] = result;
        return 1;
    }

    static pointInsideTriangle(p: Vector2, p0: Vector2, p1: Vector2, p2: Vector2): boolean {
        const v0 = new Vector2(p1.x - p0.x, p1.y - p0.y);
        const v1 = new Vector2(p2.x - p0.x, p2.y - p0.y);
        const v2 = new Vector2(p.x - p0.x, p.y - p0.y);

        const dot00 = v0.x * v0.x + v0.y * v0.y;
        const dot01 = v0.x * v1.x + v0.y * v1.y;
        const dot02 = v0.x * v2.x + v0.y * v2.y;
        const dot11 = v1.x * v1.x + v1.y * v1.y;
        const dot12 = v1.x * v2.x + v1.y * v2.y;

        const invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
        const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        return (u >= 0) && (v >= 0) && (u + v <= 1);
    }

    static rayIntersect(origin: Vector2, dir: Vector2, a: Vector2, b: Vector2): Vector2 | null {
        const ab = new Vector2(b.x - a.x, b.y - a.y);
        const q = new Vector2(origin.x - a.x, origin.y - a.y);

        const s = (q.x * ab.y - q.y * ab.x) / (dir.x * ab.y - dir.y * ab.x);

        if (s < 0 || s > 1) {
            return null;
        }

        const t = (q.x * dir.y - q.y * dir.x) / (dir.x * ab.y - dir.y * ab.x);

        if (t < 0) {
            return null;
        }

        return new Vector2(origin.x + s * dir.x, origin.y + s * dir.y);
    }

    static clamp(val: number, min: number, max: number): number {
        return Math.min(Math.max(val, min), max);
    }
}
