import Navbar from "./components/Navbar/Navbar";
import ArtisteView from "./components/Views/ArtisteView";
import CoverView from "./components/Views/CoverView";
import HomeView from "./components/Views/HomeView";
import SongView from "./components/Views/SongView";

const App = () => {
	return (
		<>
			<Navbar />
			<div className="snap-y snap-mandatory h-screen overflow-y-scroll overflow-x-hidden">
				<HomeView />
				<CoverView />
				<ArtisteView />
				<SongView />
			</div>
		</>
	);
};

export default App;
