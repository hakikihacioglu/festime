import { getEvents } from '@/data'
import '@/styles/tailwind.css'
import { ApplicationLayout } from './application-layout'

export default async function RootLayout({ children }) {
    let events = await getEvents()
    return (
        <ApplicationLayout events={events}>
            {children}
        </ApplicationLayout>
    );
}