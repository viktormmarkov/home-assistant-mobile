class AppStore {
    private store: {};
    constructor () {
        this.store = {};
    }
    set(id: string, value: any) {
        this.store[id] = value;
    }
    get(id: string) {
        return this.store[id];
    }
    safeGet(id: string, fallback: any) {
        return this.get(id) || fallback;
    }
}
const appStore = new AppStore();
export default appStore;