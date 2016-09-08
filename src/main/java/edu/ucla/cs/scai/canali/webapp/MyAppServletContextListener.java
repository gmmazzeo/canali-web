/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.ucla.cs.scai.canali.webapp;

import edu.ucla.cs.scai.canali.core.index.TokenIndex;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import org.apache.jena.system.JenaSystem;

/**
 *
 * @author Giuseppe M. Mazzeo <mazzeo@cs.ucla.edu>
 */
public class MyAppServletContextListener
        implements ServletContextListener {

    @Override
    public void contextDestroyed(ServletContextEvent arg0) {        
    }

    //Run this before web application is started
    @Override
    public void contextInitialized(ServletContextEvent arg0) {
        new TokenIndex();
        System.out.println("ServletContextListener started");
    }
}
