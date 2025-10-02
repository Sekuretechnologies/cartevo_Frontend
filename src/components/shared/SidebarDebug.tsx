// "use client";

// import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
// import urls from "@/config/urls";

// // Composant de debug pour tester les liens de la sidebar
// const SidebarDebug = () => {
//   const { createLocalizedLink } = useLocalizedNavigation();

//   const testLinks = [
//     { name: "Onboarding", url: urls.onboarding.root },
//     { name: "Wallets", url: urls.wallets.root },
//     { name: "Customers", url: urls.customers.root },
//     { name: "Cards", url: urls.cards.root },
//     { name: "Transactions", url: urls.transactions.root },
//     { name: "Developers", url: urls.developers.root },
//     { name: "Settings", url: urls.settings.root },
//   ];

//   return (
//     <div className="p-4 bg-gray-100 m-4 rounded">
//       <h3 className="font-bold mb-2">Debug Sidebar Links:</h3>
//       {testLinks.map((link) => (
//         <div key={link.name} className="mb-1">
//           <strong>{link.name}:</strong> {createLocalizedLink(link.url)}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SidebarDebug;











