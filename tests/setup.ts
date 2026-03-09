export {};

declare global {
    function pending(reason?: string): void;
}

global.pending = function(reason?: string): void {
    console.log('[PENDING] ' + (reason || ''));
};
