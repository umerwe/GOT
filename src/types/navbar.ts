export interface NavIconsProps {
    isAuth ?: boolean;
    isLoading: boolean;
    isBusiness?: boolean;
    cartCount: number;
    textColor: string;
    isHome: boolean;
    handleProtectedAction: (path: string) => void;
}


export interface NavActionsProps {
    isMobile?: boolean;
    isAuth ?: boolean;
    isBusiness?: boolean;
    isLoading: boolean;
    textColor: string;
    handleProtectedAction: (path: string) => void;
    onClose?: () => void;
}

export interface NavLinksProps {
    isMobile?: boolean;
    textColor: string;
    onClose?: () => void;
}
