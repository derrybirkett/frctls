import { Hero } from '../components/Hero';
import './app.css';

export function App() {
  return (
    <div className="min-h-screen">
      <Hero
        title="{{PROJECT_NAME}}"
        description="{{SOLUTION}}"
        ctaText="Get Started"
        ctaHref="#signup"
      />
    </div>
  );
}

export default App;
