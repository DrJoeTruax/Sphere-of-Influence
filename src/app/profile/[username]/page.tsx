import Header from "@/components/Header";

export default function Page({ params }: any) {
  return (
    <div className='pt-24'>
      <Header />
      <div className='p-8 text-center'>
        <h1 className='text-3xl font-bold'>Coming soon</h1>
        <p className='text-gray-400'>Path: src/app/profile/[username]/page.tsx</p>
      </div>
    </div>
  );
}
