import MiniAppProvider from "./components/MiniAppProvider";
import EndorsementFlow from "./components/EndorsementFlow";

export default function Home() {
    return (
        <MiniAppProvider>
            <EndorsementFlow />
        </MiniAppProvider>
    );
}
