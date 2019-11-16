import { registerAppComponent } from "./app-component/app-component";
import { registerConversationList } from "./conversation-list";

export function registerComponents() {
    registerConversationList();
    registerAppComponent();
}