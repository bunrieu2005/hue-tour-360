import { villages, type Village } from '@/data/villages';

export interface VillageMapConfiguration {
    available: boolean;
    canAccess: boolean;
    path: string | null;
}

export type VillageMap = VillageMapConfiguration & {
    villageId: string;
    name: Village['name'];
};

export const villageMaps: Record<string, VillageMapConfiguration> = {
    'sinh-painting': {
        available: true,
        canAccess: true,
        path: '/maps/sinh-painting/index.html',
    },
    'thanh-tien-paper-flower': {
        available: false,
        canAccess: false,
        path: null,
    },
    'thuy-xuan-incense': {
        available: false,
        canAccess: false,
        path: null,
    },
    'non-la-conical-hat': {
        available: false,
        canAccess: false,
        path: null,
    },
    'phap-lam-enamel': {
        available: false,
        canAccess: false,
        path: null,
    },
    'phuoc-tich-pottery': {
        available: false,
        canAccess: false,
        path: null,
    },
    'a-luoi-weaving': {
        available: false,
        canAccess: false,
        path: null,
    },
    'kim-long-woodwork': {
        available: false,
        canAccess: false,
        path: null,
    },
};

export function getVillageMap(villageId: string): VillageMap | undefined {
    const village = villages.find((item) => item.id === villageId);
    const configuration = villageMaps[villageId];

    if (!village || !configuration) return undefined;

    return {
        villageId,
        name: village.name,
        ...configuration,
    };
}

export function canAccessVillageMap(
    map: VillageMapConfiguration | undefined
): map is VillageMapConfiguration & { path: string } {
    return Boolean(map?.available && map.canAccess && map.path);
}
