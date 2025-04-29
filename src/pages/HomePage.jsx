import ProjectDisplay from './displayProject';
import Nav from '../pages/nav'; 

function HomePage() {
  return (
    <div className="bg-home min-h-screen">
      <Nav />
      <div className="container mx-auto mt-10 px-6">
        <ProjectDisplay />
      </div>
    </div>
  );
}

export default HomePage;
