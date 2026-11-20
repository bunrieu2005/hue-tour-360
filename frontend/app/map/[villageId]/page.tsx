import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import VillageMapPage from '@/components/VillageMapPage';
import { getVillageMap } from '@/data/villageMaps';

interface VillageMapRouteProps {
    params: Promise<{ villageId: string }>;
}

export async function generateMetadata({
    params,
}: VillageMapRouteProps): Promise<Metadata> {
    const { villageId } = await params;
    const map = getVillageMap(villageId);

    return {
        title: map ? `Bản đồ ${map.name.vi} | Tour Huế` : 'Bản đồ | Tour Huế',
    };
}

export default async function VillageMapRoute({
    params,
}: VillageMapRouteProps) {
    const { villageId } = await params;
    const map = getVillageMap(villageId);

    if (!map) notFound();

    return <VillageMapPage map={map} />;
}
