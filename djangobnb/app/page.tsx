import Categories from "./components/Categories";
import PropertyList from "./components/properties/PropertyList";
export default function Home() {
  return (
  <main>
    <Categories />
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
    <PropertyList />
    </div>
  </main>
    
  )
}
