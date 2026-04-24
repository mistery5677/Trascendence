import { ToastWrapper } from "./components";
import { MainRouter } from "./routers/MainRouter/MainRouter";
import "./styles/global.css";
import "./styles/theme.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
	return (
		<>
			<ToastWrapper>
				<MainRouter />
			</ToastWrapper>
		</>
	);
}

export default App;
