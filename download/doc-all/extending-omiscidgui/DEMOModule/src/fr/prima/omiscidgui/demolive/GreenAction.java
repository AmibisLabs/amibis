/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package fr.prima.omiscidgui.demolive;

import fr.prima.omiscid.user.connector.ConnectorListener;
import fr.prima.omiscid.user.connector.ConnectorType;
import fr.prima.omiscid.user.connector.Message;
import fr.prima.omiscid.user.service.Service;
import fr.prima.omiscidgui.browser.ServiceClient;
import fr.prima.omiscidgui.browser.interf.AbstractContextAwareAction;
import fr.prima.omiscidgui.selector.generic.OmiscidConnectorTask;
import java.awt.event.ActionEvent;
import java.io.IOException;
import javax.swing.Action;
import javax.swing.SwingUtilities;
import org.openide.util.Exceptions;
import org.openide.util.Lookup;
import org.openide.util.NbBundle;
import org.openide.util.Utilities;

/**
 *
 * @author twilight
 */
public class GreenAction extends AbstractContextAwareAction<OmiscidConnectorTask> {

    public GreenAction() {
        this(Utilities.actionsGlobalContext());
    }

    public GreenAction(Lookup lookup) {
        super(OmiscidConnectorTask.class, lookup);
        putValue("noIconInMenu", Boolean.TRUE);
        putValue(Action.NAME, NbBundle.getMessage(GreenAction.class, "CTL_GreenAction"));
        // this must correspond to an entry in the Bundle.properties file
    }

    public Action createContextAwareInstance(Lookup lookup) {
        return new GreenAction(lookup);
    }

    @Override
    protected void updateAction(Lookup lookup) {
        if (lookup.lookupAll(OmiscidConnectorTask.class).isEmpty()) {
            setEnabled(false);
        } else {
            setEnabled(true);
        }
    }

    @Override
    public void actionPerformed(Lookup lookup, ActionEvent ae) {
        final ServiceClient serviceClient = lookup.lookup(ServiceClient.class);
        for (OmiscidConnectorTask task : lookup.lookupAll(OmiscidConnectorTask.class)) {
            popup(serviceClient, task);
        }
    }

    private void popup(final ServiceClient client, final OmiscidConnectorTask task) {
        try {
            final String local = client.getConnector(ConnectorType.INPUT);
            final Service service = client.getConnectorService(local);

            final FaceSignal panel = new FaceSignal() {
                @Override
                protected void componentClosed() {
                    client.freeConnector(local);
                }
            };

            panel.open();

            service.addConnectorListener(local, new ConnectorListener() {

                public void messageReceived(Service srvc, String string, Message msg) {
                    boolean noFace = msg.getBufferAsStringUnchecked().startsWith("0");
                    panel.setFace(! noFace);
                }

                public void disconnected(Service srvc, String string, int i) {
                    SwingUtilities.invokeLater(new Runnable() {
                        public void run() {
                            panel.close();
                        }
                    });
                }

                public void connected(Service srvc, String string, int i) {
                }
            });
            service.connectTo(local, task.getServiceProxy(), task.getConnectorName());

        } catch (IOException ex) {
            Exceptions.printStackTrace(ex);
        }
    }
}
