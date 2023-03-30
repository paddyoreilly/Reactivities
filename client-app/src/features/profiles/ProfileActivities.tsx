import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { SyntheticEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Tab, Image, Icon, Grid, Header, TabProps } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponents";
import { useStore } from "../../app/stores/store";

const panes = [
    { menuItem: 'Future Events', pane: { key: 'future' } },
    { menuItem: 'Past Events', pane: { key: 'past' } },
    { menuItem: 'Hosting', pane: { key: 'host' } }
]

export default observer(function ProfileActivities() {
    const { profileStore } = useStore();
    const { userActivities, loadingActivities, loadUserActivities } = profileStore;

    useEffect(() => {
        loadUserActivities('future')
    }, [loadUserActivities])

    function handleTabChange(e: SyntheticEvent, data: TabProps) {
        loadUserActivities(panes[data.activeIndex as number].pane.key)
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon='calendar' content={'Activities'} />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab
                        panes={panes}
                        menu={{ secondary: true, pointing: true }}
                        onTabChange={(e, data) => handleTabChange(e, data)}
                    />
                    <br />
                </Grid.Column>
                <Grid.Column width={16}>
                    {loadingActivities ? <LoadingComponent content="Loading Activities..." /> :
                        <Card.Group itemsPerRow={4}>
                            {userActivities.map(activity => (
                                <Card as={Link} to={`/activities/${activity.id}`} key={activity.id}>
                                    <Image src={`/assets/categoryImages/${activity.category}.jpg`} style={{ objectFit: 'cover' }} />
                                    <Card.Content textAlign="center">
                                        <Card.Header>{activity.title}</Card.Header>
                                        <Card.Meta>
                                            <div><Icon name="calendar" /> {format(new Date(activity.date), 'do MMM')}</div>
                                            <div><Icon name="clock" /> {format(new Date(activity.date), 'h:mm a')}</div>
                                        </Card.Meta>
                                    </Card.Content>
                                </Card>
                            ))}
                        </Card.Group>}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})