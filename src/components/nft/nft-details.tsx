import cn from 'classnames';
import { StaticImageData } from 'next/image';
import ParamTab, { TabPanel } from '@/components/ui/param-tab';
import Image from '@/components/ui/image';
import FeaturedCard from '@/components/nft/featured-card';
import ListCard from '@/components/ui/list-card';
import AuctionCountdown from '@/components/nft/auction-countdown';
import AnchorLink from '@/components/ui/links/anchor-link';
import Button from '@/components/ui/button';
import { ArrowLinkIcon } from '@/components/icons/arrow-link-icon';
import { DotsIcon } from '@/components/icons/dots-icon';
import Avatar1 from '@/assets/images/avatar/3.png';
import { useModal } from '@/components/modal-views/context';
import { nftData } from '@/data/static/single-nft';
import NftDropDown from './nft-dropdown';
import Avatar from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import { uProduct, uInvertion } from '../../redux/Blockchain/blockchainAction';

interface NftFooterProps {
  className?: string;

  price: number;
  tipo: string;
  tipoN: string;
  id: number;
}

type Avatar = {
  id: string | number;
  name: string;
  slug: string;
  logo: StaticImageData;
};

function NftFooter({
  className = 'md:hidden',
  price,
  tipo,
  tipoN,
  id,
}: NftFooterProps) {
  const { openModal } = useModal();
  const [tokenAddress, setTokenAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [cuenta, setCuenta] = useState('');
  const [approvedUsdt, setApprovedUsdt] = useState(0);
  const [approvedToken, setApprovedToken] = useState(0);
  const [status, setStatus] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const Usuario = useSelector((state) => state.Usuario);
  const [auxPrice, setAuxPrice] = useState(price);

  const {
    productoMinter,
    inversionMinter,
    isConnect,
    accountAddress,
    tokenContract,
    usdtContract,
  } = useSelector((state) => state.blockchain);

  const { referidor } = useSelector((state) => state.Usuario);
  const dispatch = useDispatch<AppDispatch>();

  const verifyApprove = async () => {
    try {
      if (tipo == 'producto') {
        const usdt = await tokenContract.allowance(
          accountAddress,
          productoMinter.address
        );
        alert(price); //MarketPlace
        //setApprovedUsdt(ethers.utils.formatUnits(usdt, 18));
        setApprovedToken(ethers.utils.formatUnits(usdt, 6));
      } else if (tipo == 'inversion') {
        const usdt = await tokenContract.allowance(
          accountAddress,
          inversionMinter.address
        ); //MarketPlace
        //setApprovedUsdt(ethers.utils.formatUnits(usdt, 18));
        setApprovedToken(ethers.utils.formatUnits(usdt, 6));
      }
    } catch (e) {}
  };

  const approve = async () => {
    setLoading(true);

    try {
      if (tipo == 'producto') {
        setTokenAddress(tokenContract.address);

        const decimals = 6;

        const tx = await tokenContract.approve(
          productoMinter.address,
          ethers.utils.parseUnits(price.toString(), decimals)
        );
        setAuxPrice(ethers.utils.parseUnits(price.toString(), decimals));
        await tx.wait();
        await verifyApprove();
        setLoading(false);
      } else if (tipo == 'inversion') {
        setTokenAddress(tokenContract.address);
        const decimals = 6;
        const tx = await tokenContract.approve(
          inversionMinter.address,
          ethers.utils.parseUnits(price.toString(), decimals)
        );

        await tx.wait();
        await verifyApprove();
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const buyNft = async () => {
    setLoading(true);
    try {
      if (tipo == 'producto') {
        if (Usuario.isReferido && Usuario.type == 'Agente X') {
          let porcentaje = 0;
          if (Usuario.range == 'peerx') {
            porcentaje = 200;
          } else if (Usuario.range == 'blockelite') {
            porcentaje = 250;
          } else if (Usuario.range == 'blockmaster') {
            porcentaje = 350;
          } else if (Usuario.range == 'blockcreator') {
            porcentaje = 400;
          }

          const tx = await productoMinter.buyTokenWithReferido(
            tipoN,
            tokenContract.address,
            referidor,
            porcentaje
          );
          //referidos
          await tx.wait();
          setLoading(false);
          setApprovedToken(0);
          dispatch(uProduct());
          setStatus(true);
          setAlertMsg('Nft comprado exitosamente');
        } else {
          const tx = await productoMinter.buyToken(
            tipoN,
            tokenContract.address
          );

          await tx.wait(); //tener en cuenta para los proximos cambios
          setLoading(false);
          setApprovedToken(0);
          dispatch(uProduct());
          setStatus(true);
          setAlertMsg('Nft comprado exitosamente');
        }
      } else if (tipo == 'inversion') {
        const tx = await inversionMinter.buyToken(tipoN, tokenContract.address);
        await tx.wait();
        setLoading(false);
        setApprovedToken(0);
        dispatch(uInvertion());
        setStatus(true);
        setAlertMsg('Nft comprado exitosamente');
      }
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setStatus(false);
    }, 5000);
  }, [status]);
  return (
    <div
      className={cn(
        'sticky bottom-0 z-10 bg-body dark:bg-dark md:-mx-2',
        className
      )}
    >
      <div className="-mx-4 border-t-2 border-gray-900 px-4 pt-4 pb-5 dark:border-gray-700 sm:-mx-6 sm:px-6 md:mx-2 md:px-0 md:pt-5 lg:pt-6 lg:pb-7">
        <div className="flex gap-4 pb-3.5 md:pb-4 xl:gap-5">
          <div className="block w-1/2 shrink-0 md:w-2/5">
            <h3 className="mb-1 truncate text-13px font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:mb-1.5 sm:text-sm">
              Precio <span className="md:hidden">by</span>{' '}
              <AnchorLink
                href={'#'}
                className="normal-case text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white md:hidden"
              ></AnchorLink>
            </h3>
            <div className="text-lg font-medium -tracking-wider md:text-xl xl:text-2xl">
              {price} USDT
            </div>
            <AnchorLink
              href={'#'}
              className="mt-2 hidden items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white md:inline-flex"
            >
              <div className="h-6 w-6 rounded-full ltr:mr-2 rtl:ml-2">
                <Image src={Avatar1} alt="avatar" width={24} height={24} />
              </div>
              @PandoraX
            </AnchorLink>
          </div>
        </div>

        {tipo == 'producto' && (
          <div className="grid grid-cols-2 gap-3">
            {!loading && parseInt(price) > approvedToken && (
              <Button shape="rounded" onClick={() => approve()}>
                Aprobar
              </Button>
            )}
            {!loading && parseInt(price) <= approvedToken && (
              <Button shape="rounded" onClick={() => buyNft()}>
                {`Comprar por ${price} `}
              </Button>
            )}
            {loading && <Button shape="rounded">Cargando...</Button>}
            <Button
              shape="rounded"
              variant="solid"
              color="gray"
              className="dark:bg-gray-800"
              onClick={() => openModal('SHARE_VIEW')}
            >
              Compartir
            </Button>
          </div>
        )}

        {tipo == 'inversion' && (
          <div className="grid grid-cols-2 gap-3">
            {!loading && parseInt(price) > approvedToken && (
              <Button shape="rounded" onClick={() => approve()}>
                Aprobar
              </Button>
            )}
            {!loading && parseInt(price) <= approvedToken && (
              <Button shape="rounded" onClick={() => buyNft()}>
                {`Comprar por ${price} `}
              </Button>
            )}
            {loading && <Button shape="rounded">Cargando...</Button>}
            <Button
              shape="rounded"
              variant="solid"
              color="gray"
              className="dark:bg-gray-800"
              onClick={() => openModal('SHARE_VIEW')}
            >
              Compartir
            </Button>
          </div>
        )}

        {tipo == 'pcomprado' && (
          <div className="grid grid-cols-2 gap-3">
            <Button shape="rounded">Transfer</Button>
          </div>
        )}

        {tipo == 'invcomprado' && (
          <div className="grid grid-cols-2 gap-3">
            <Button shape="rounded">Transfer</Button>
            <AnchorLink href={`/staking/${id}`}>
              <Button variant="solid" shape="rounded">
                Stake
              </Button>
            </AnchorLink>
          </div>
        )}
      </div>
      {status && (
        <div
          className="absolute top-[200px] right-[100px] mb-4 mt-[0px] w-[300px] justify-center self-center rounded-lg bg-green-200  p-4 text-sm text-green-700 dark:bg-green-200 dark:text-green-800"
          role="alert"
        >
          <span className="font-medium">{alertMsg}</span>
        </div>
      )}
    </div>
  );
}

export default function NftDetails({ product, type }) {
  const { img, Nombre, descripcion, precio, id, tipo, tipoN } = product;

  const [tokenAddress, setTokenAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [cuenta, setCuenta] = useState('');
  const [approvedUsdt, setApprovedUsdt] = useState(0);
  const [approvedToken, setApprovedToken] = useState(0);
  const [status, setStatus] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const Usuario = useSelector((state) => state.Usuario);

  const {
    productoMinter,
    inversionMinter,
    isConnect,
    accountAddress,
    usdtContract,
    tokenContract,
  } = useSelector((state) => state.blockchain);

  const { referidor } = useSelector((state) => state.Usuario);
  const dispatch = useDispatch<AppDispatch>();

  const verifyApprove = async () => {
    try {
      if (type == 'producto') {
        const usdt = await tokenContract.allowance(
          accountAddress,
          productoMinter.address
        ); //MarketPlace
        //setApprovedUsdt(ethers.utils.formatUnits(usdt, 18));
        setApprovedToken(ethers.utils.formatUnits(usdt, 6));
      } else if (type == 'inversion') {
        const usdt = await tokenContract.allowance(
          accountAddress,
          inversionMinter.address
        ); //MarketPlace
        //setApprovedUsdt(ethers.utils.formatUnits(usdt, 18));
        setApprovedToken(ethers.utils.formatUnits(usdt, 6));
      }
    } catch (e) {}
  };

  const approve = async () => {
    setLoading(true);

    try {
      if (type == 'producto') {
        setTokenAddress(tokenContract.address);

        const decimals = 6;

        const tx = await tokenContract.approve(
          productoMinter.address,
          ethers.utils.parseUnits(product.precio.toString(), decimals)
        );

        await tx.wait();
        await verifyApprove();
        setLoading(false);
      } else if (type == 'inversion') {
        setTokenAddress(tokenContract.address);
        const decimals = 6;
        const tx = await tokenContract.approve(
          inversionMinter.address,
          ethers.utils.parseUnits(product.precio.toString(), decimals)
        );

        await tx.wait();
        await verifyApprove();
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const buyNft = async () => {
    setLoading(true);
    try {
      if (type == 'producto') {
        if (Usuario.isReferido && Usuario.type == 'Agente X') {
          let porcentaje = 0;
          if (Usuario.range == 'peerx') {
            porcentaje = 200;
          } else if (Usuario.range == 'blockelite') {
            porcentaje = 250;
          } else if (Usuario.range == 'blockmaster') {
            porcentaje = 350;
          } else if (Usuario.range == 'blockcreator') {
            porcentaje = 400;
          }

          const tx = await productoMinter.buyTokenWithReferido(
            tipoN,
            tokenContract.address,
            referidor,
            porcentaje
          );
          //referidos
          await tx.wait();
          setLoading(false);
          setApprovedToken(0);
          dispatch(uProduct());
          setStatus(true);
          setAlertMsg('Nft comprado exitosamente');
        } else {
          const tx = await productoMinter.buyToken(
            tipoN,
            tokenContract.address
          );

          await tx.wait(); //tener en cuenta para los proximos cambios
          setLoading(false);
          setApprovedToken(0);
          dispatch(uProduct());
          setStatus(true);
          setAlertMsg('Nft comprado exitosamente');
        }
      } else if (type == 'inversion') {
        const tx = await inversionMinter.buyToken(tipoN, tokenContract.address);
        await tx.wait();
        setLoading(false);
        setApprovedToken(0);
        dispatch(uInvertion());
        setStatus(true);
        setAlertMsg('Nft comprado exitosamente');
      }
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setStatus(false);
    }, 5000);
  }, [status]);
  return (
    <div className="flex flex-grow">
      <div className="mx-auto flex w-full flex-grow flex-col transition-all xl:max-w-[1360px] 4xl:max-w-[1760px]">
        <div className="relative mb-5 flex flex-grow items-center justify-center md:pb-7 md:pt-4 ltr:md:left-0 ltr:md:pl-6 rtl:md:right-0 rtl:md:pr-6 lg:fixed lg:mb-0 lg:h-[calc(100%-96px)] lg:w-[calc(100%-492px)] ltr:lg:pl-8 rtl:lg:pr-8 xl:w-[calc(100%-550px)] ltr:xl:pr-12 ltr:xl:pl-[340px] rtl:xl:pl-12 rtl:xl:pr-[340px] ltr:2xl:pl-96 rtl:2xl:pr-96 3xl:w-[calc(100%-632px)] ltr:4xl:pl-0 rtl:4xl:pr-0">
          <div className="flex h-full max-h-full w-full items-center justify-center lg:max-w-[768px]">
            <div className="relative aspect-square max-h-full w-full overflow-hidden rounded-lg">
              <Image
                src={img}
                //placeholder="blur"
                layout="fill"
                objectFit="cover"
                alt=""
                className="h-full bg-gray-200 dark:bg-light-dark"
              />
            </div>
          </div>
        </div>

        <div className="relative mt-10 flex w-full flex-grow flex-col justify-between ltr:md:ml-auto ltr:md:pl-8 rtl:md:mr-auto rtl:md:pr-8 lg:min-h-[calc(100vh-96px)] lg:w-[460px] ltr:lg:pl-12 rtl:lg:pr-12 xl:w-[592px] ltr:xl:pl-20 rtl:xl:pr-20">
          <div className="block">
            <div className="block">
              <div className="flex justify-between">
                <h2 className="text-xl font-medium leading-[1.45em] -tracking-wider text-gray-900 dark:text-white md:text-2xl xl:text-3xl">
                  {Nombre}
                </h2>
              </div>
            </div>
            <div className="mt-5 flex flex-col pb-5 xl:mt-9">
              <ParamTab
                tabMenu={[
                  {
                    title: 'Details',
                    path: 'details',
                  },
                ]}
              >
                <TabPanel className="focus:outline-none">
                  <div className="space-y-6">
                    <div className="block">
                      <h3 className="text-heading-style mb-2 uppercase text-gray-900 dark:text-white">
                        Description
                      </h3>
                      <div className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400">
                        {descripcion}
                      </div>
                    </div>
                    <div className="block">
                      <h3 className="text-heading-style mb-2 uppercase text-gray-900 dark:text-white">
                        Owner
                      </h3>

                      <div className="inline-flex">
                        <span className="rounded-full p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                          @PandoraX
                        </span>{' '}
                      </div>
                    </div>
                    <div className="block">
                      <h3 className="text-heading-style mb-2 uppercase text-gray-900 dark:text-white">
                        Block Chain
                      </h3>

                      <div className="flex flex-col gap-2">
                        <div className="inline-flex">
                          <span className="rounded-full p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                            Polygon
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 justify-evenly space-x-10">
                    {/*type !== 'invcomprado' &&
                      type !== 'pcomprado' &&
                      !loading &&
                      product.precio > approvedToken && (
                        <Button onClick={approve}>Approve</Button>
                      )*/}

                    {loading && (
                      <Button>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Loading...
                      </Button>
                    )}

                    {type !== 'invcomprado' &&
                      type !== 'pcomprado' &&
                      !loading &&
                      product.precio <= approvedToken && (
                        <Button onClick={() => buyNft()}>Buy</Button>
                      )}

                    {/*type !== 'pcomprado' &&
                      !loading &&
                      type !== 'invcomprado' && (
                        <Button>Buy without cripto</Button>
                      )*/}

                    {/*type == 'pcomprado' && type !== 'invcomprado' && (
                      <Button onClick={() => buyNft()}>transfer</Button>
                    )*/}

                    {/*type == 'invcomprado' && (
                      <Button onClick={() => buyNft()}>Stake</Button> //anchor link
                    )*/}
                    {/*type == 'invcomprado' && (
                      <Button onClick={() => buyNft()}>Transfer</Button> //Modal
                    )*/}
                    <NftFooter
                      className="hidden md:block"
                      price={precio}
                      tipo={type}
                      tipoN={tipoN}
                      id={id}
                    />
                  </div>
                </TabPanel>
              </ParamTab>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
