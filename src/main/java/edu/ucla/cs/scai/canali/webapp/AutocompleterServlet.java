/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.ucla.cs.scai.canali.webapp;

import com.google.gson.Gson;
import edu.ucla.cs.scai.canali.core.autocompleter.AutocompleteObject;
import edu.ucla.cs.scai.canali.core.autocompleter.AutocompleteService;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Giuseppe M. Mazzeo <mazzeo@cs.ucla.edu>
 */
public class AutocompleterServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     *
     */
    public static final String QUERY = "q", LAST_ACCEPTED_PROPERTY = "p", 
            OPEN_VARIABLES_URI = "ou", OPEN_VARIABLES_POSITION = "op", 
            STATE = "s", FINAL_PUNCTUATION = "f", 
            CONTEXT_RULES_DISABLED = "crd", AUTO_ACCEPTANCE = "aa",
            DATE_TO_NUMBER = "dtn", USE_KEYWORDS = "k";

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        response.setContentType("application/json;charset=UTF-8");

        String query = request.getParameter(QUERY);
        String lastAcceptedProperty = request.getParameter(LAST_ACCEPTED_PROPERTY);
        String openVariablesUri = request.getParameter(OPEN_VARIABLES_URI);
        String openVariablesPosition = request.getParameter(OPEN_VARIABLES_POSITION);
        String state = request.getParameter(STATE);
        String finalPunctuation = request.getParameter(FINAL_PUNCTUATION);
        String contextRulesDisabled = request.getParameter(CONTEXT_RULES_DISABLED);
        String autoAcceptance = request.getParameter(AUTO_ACCEPTANCE);
        String dateToNumber = request.getParameter(DATE_TO_NUMBER);
        String uk = request.getParameter(USE_KEYWORDS);
        Boolean useKeywords = uk!=null && (uk.equals("1") || uk.equals("true"));
        
        Integer[] op = null;
        if (openVariablesPosition != null && openVariablesPosition.length() > 0) {
            String[] opss = openVariablesPosition.split(",");
            op = new Integer[opss.length];
            for (int i = 0; i < opss.length; i++) {
                op[i] = Integer.parseInt(opss[i]);
            }
        }
         ArrayList<AutocompleteObject> res = new AutocompleteService().getAutocompleResults(query, lastAcceptedProperty, (openVariablesUri == null || openVariablesUri.length() == 0) ? null : openVariablesUri.split(","), op, state, finalPunctuation, contextRulesDisabled != null && contextRulesDisabled.toLowerCase().equals("true"), autoAcceptance != null && autoAcceptance.toLowerCase().equals("true"), "true".equals(dateToNumber), useKeywords.booleanValue());

        try (PrintWriter out = response.getWriter()) {
            out.print("[");
            if (!res.isEmpty()) {
                out.print(res.get(0).toJson());
            }
            for (int i=1; i<res.size(); i++) {
                out.print(", "+res.get(i).toJson());
            }
            out.println("]");
            /*
             if ($_GET["callback"]) {
             $json_response = $_GET["callback"] . "(" . $json_response . 
             }")";
             */
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
