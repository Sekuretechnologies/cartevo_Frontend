import {
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const TabsComponent = ({ data }: { data: string[] } ) => {
  return (
    <>
      <TabsList>
        {data.map((item, index) => (
          <TabsTrigger key={index} value={item}>{item}</TabsTrigger>
        ))}
      </TabsList>
    </>
  )
}

export default TabsComponent
