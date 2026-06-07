import { Suspense } from 'react';
import Categories from "./components/Categories";
import PropertyList from "./components/properties/PropertyList";
import BookingSuccessBanner from "./components/BookingSuccessBanner";

export default function Home() {
  return (
    <main className="max-w-375 mx-auto px-6">
      <Suspense fallback={null}>
        <BookingSuccessBanner />
      </Suspense>
      <Categories />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <Suspense fallback={<div className="col-span-full text-center py-12 text-gray-500">Loading properties...</div>}>
          <PropertyList />
        </Suspense>
      </div>
    </main>
  );
}
