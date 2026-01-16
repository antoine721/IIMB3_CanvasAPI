import CoverView from "./components/Views/CoverView";
import HomeView from "./components/Views/HomeView";
import SongView from "./components/Views/SongView";

const App = () => {
  return (
    <div className="h-screen overflow-y-scroll overflow-x-hidden">
      <HomeView />
      <SongView />
      <CoverView />
    </div>
  );
};

export default App;
