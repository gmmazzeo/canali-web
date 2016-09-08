/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.ucla.cs.scai.canali.webapp;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import edu.ucla.cs.scai.canali.core.index.TokenIndex;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Giuseppe M. Mazzeo <mazzeo@cs.ucla.edu>
 */
public class PropertySearchServlet extends HttpServlet {

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
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        response.setContentType("application/json;charset=UTF-8");

        JsonParser jp=new JsonParser();
        JsonArray ja=jp.parse(request.getParameter("s")).getAsJsonArray();
        String label=null;
        String restrictedText;
        for (Iterator<JsonElement> it=ja.iterator(); it.hasNext(); ) {
            JsonObject jo=it.next().getAsJsonObject();
            label=jo.get("l").getAsString();
            restrictedText=jo.get("r").getAsString();
            break;
        }
        String endpoint = request.getParameter("e");
        String limitS = request.getParameter("l");
        int limit = 100;
        try {
            limit = Integer.parseInt(limitS);
        } catch (Exception e) {

        }
        HashSet<String>[][] res = null;
        try {
            res = new TokenIndex().describeProperty(label, limit);
        } catch (Exception ex) {
            ex.printStackTrace();
            res[0][0]=new HashSet<>();
            res[0][0].add("Error");
            res[0][1].add(ex.getMessage());
        }

        Gson gson=new Gson();
        try (PrintWriter out = response.getWriter()) {
            out.println(gson.toJson(res));
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
