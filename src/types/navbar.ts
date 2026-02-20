export interface NavIconsProps {
    isAuth: any;
    mounted: boolean;
    cartCount: number;
    textColor: string;
    isHome: boolean;
    handleProtectedAction: (path: string) => void;
}


export interface NavActionsProps {
    isMobile?: boolean;
    isAuth: any;
    mounted: boolean;
    textColor: string;
    handleProtectedAction: (path: string) => void;
    onClose?: () => void;
}

export interface NavLinksProps {
    isMobile?: boolean;
    textColor: string;
    onClose?: () => void;
}
