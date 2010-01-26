/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package fr.prima.omiscidgui.demolive;

import java.awt.Color;
import java.awt.Graphics;
import org.openide.windows.TopComponent;

/**
 *
 * @author twilight
 */
public class FaceSignal extends TopComponent {

    boolean face;

    public boolean isFace() {
        return face;
    }

    public void setFace(boolean face) {
        if (this.face != face) {
            this.face = face;
            repaint();
        }
    }



    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        g.setColor(face ? Color.GREEN : Color.DARK_GRAY);
        g.fillRect(0, 0, this.getWidth(), this.getHeight());
    }

}
