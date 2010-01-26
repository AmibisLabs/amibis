/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package fr.prima.omiscidgui.demolive;

import fr.prima.omiscidgui.browser.interf.AbstractOmiscidSelector;
import fr.prima.omiscidgui.browser.interf.Service;
import fr.prima.omiscidgui.selector.generic.OmiscidVariableTask;
import java.util.ArrayList;
import java.util.Collection;

/**
 *
 * @author twilight
 */
public class StrangeSelector extends AbstractOmiscidSelector<Service> {

    public StrangeSelector() {
        super(Service.class);
    }

    @Override
    protected void getTasks(ArrayList result, Collection<Service> selection) {
        for (Service service : selection) {
            if (service.getName().equals("FaceDetector")) {
                result.add(new OmiscidVariableTask(service.getServiceProxy(), "currentWorkingDirectory"));
                result.add(new OmiscidVariableTask(service.getServiceProxy(), "owner"));
            }
        }
    }

}
