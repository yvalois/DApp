import ParamTab, { TabPanel } from '@/components/ui/param-tab';
import ListCard from '@/components/ui/list-card';
import TransactionSearchForm from '@/components/author/transaction-search-form';
import TransactionHistory from '@/components/author/transaction-history';
import CollectionCard from '@/components/ui/collection-card';
import { useDispatch, useSelector } from 'react-redux';
import NFTGrid from '@/components/ui/nft-card';
import StakingTable from '@/components/transaction/stakingTable';
import TransactionUserTable from '@/components/transaction/transactionUserTable';
// static data
import { collections } from '@/data/static/collections';
import {
  authorWallets,
  authorNetworks,
  authorProtocols,
} from '@/data/static/author-profile';
import { useEffect, useState } from 'react';
import { getMintedNftProducts } from '@/redux/Minted/MintedAction';
import StakingTableF from '../transaction/stakingTableF';

export default function ProfileTabUser() {
  const [currentItems, setCurrentItems] = useState([]);
  const [currentInv, setCurrentInv] = useState([]);
  const [currentF, setCurrentF] = useState([]);

  const { inventoryp, inventoryi, inventoryf } = useSelector(
    (state: any) => state.blockchain
  );

  const { dataloaded, disponibleNftp, disponibleNfti, priceFormat, MintedNft } =
    useSelector((state: any) => state.minted);

  const Usuario = useSelector((state: any) => state.blockchain.rol);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setCurrentItems(inventoryp);
    setCurrentInv(inventoryi);
    setCurrentF(inventoryf);

    setTimeout(() => {}, 5000);
  }, [inventoryp, inventoryi, inventoryf]);

  return (
    <ParamTab
      tabMenu={[
        /*{
          title: 'Mis productos',
          path: 'productos',
        },*/
        {
          title: 'Inversiones',
          path: 'inversiones',
        },
        {
          title: 'Fr3nchies Blue',
          path: 'coleccion',
        },
        {
          title: 'Staking',
          path: 'staking',
        },
        {
          title: 'Pagos',
          path: 'pagos',
        },
      ]}
    >
      {/* <TabPanel className="w-full focus:outline-none">
        <div className="grid w-full gap-10 xxs:grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-20 3xl:grid-cols-3 4xl:grid-cols-4">
          {currentItems?.map((nft) => (
            <NFTGrid
              key={nft.Nombre}
              name={nft.Nombre}
              image={nft.img}
              price={nft.precio}
              number={nft.id}
              alldata={false}
              type={'productos'}
            />
          ))}
          {currentItems.length == 0 && (
            <div className=" flex h-full  w-full justify-center self-center">
              <div className="w-full items-center justify-center">
                <div className=" h-full w-full">
                  <span>
                    <h1 className="md:text-md text-gray-600 md:w-[500px] xl:w-[700px] xl:text-lg">
                      No tienes Nft's de productos
                    </h1>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
          </TabPanel> */}
      <TabPanel className="h-full w-full focus:outline-none">
        <div className="ml-6 grid h-full   w-full  gap-4 xs:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 lg:gap-5 xl:gap-6  3xl:grid-cols-3 4xl:grid-cols-4">
          {currentInv?.map((nft) => (
            <NFTGrid
              key={nft.Nombre}
              name={nft.Nombre}
              image={nft.img}
              price={13}
              number={nft.id}
              alldata={false}
              type={'staking'}
            />
          ))}
          {currentInv.length == 0 && (
            <div className="flex h-full w-full  items-center justify-center ">
              <div className=" h-full w-full">
                <span>
                  <h1 className="md:text-md text-gray-600 md:w-[500px] xl:w-[700px] xl:text-lg">
                    No tienes Nft's de inversion
                  </h1>
                </span>
              </div>
            </div>
          )}
        </div>
      </TabPanel>
      <TabPanel className="h-full w-full focus:outline-none">
        <div className="ml-6 grid h-full   w-full  gap-4 xs:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 lg:gap-5 xl:gap-6  3xl:grid-cols-3 4xl:grid-cols-4">
          {currentF?.map((nft) => (
            <NFTGrid
              key={nft.name}
              name={nft.name}
              image={nft.image}
              price={13}
              number={nft.id}
              alldata={false}
              type={'Frenchies Blues'}
            />
          ))}
          {currentF.length == 0 && (
            <div className="flex h-full w-full  items-center justify-center ">
              <div className=" h-full w-full">
                <span>
                  <h1 className="md:text-md text-gray-600 md:w-[500px] xl:w-[700px] xl:text-lg">
                    No tienes Nft's
                  </h1>
                </span>
              </div>
            </div>
          )}
        </div>
      </TabPanel>

      <TabPanel className="w-full focus:outline-none  ">
        <div className="grid h-full w-full grid-cols-1 gap-4 lg:gap-5 xl:gap-6 xl:space-x-8">
          <StakingTable />
        </div>
      </TabPanel>
      <TabPanel className="focus:outline-none">
        <div className="grid h-full w-full grid-cols-1 gap-4 lg:gap-5 xl:gap-6 xl:space-x-8">
          <TransactionUserTable />
        </div>
      </TabPanel>
    </ParamTab>
  );
}
