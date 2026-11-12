import type {Metadata} from 'next';
import type {ReactNode} from 'react';
export const metadata:Metadata={
 title:{default:'M.GH.AL Administration',template:'%s | M.GH.AL Admin'},
 robots:{index:false,follow:false,noarchive:true}
};
export default function AdminLayout({children}:{children:ReactNode}){return children;}
