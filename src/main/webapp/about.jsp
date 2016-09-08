<%-- 
    Document   : desc
    Created on : Jul 31, 2015, 2:44:07 PM
    Author     : Giuseppe M. Mazzeo <mazzeo@cs.ucla.edu>
--%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        <link rel="stylesheet" href="http://yellowstone.cs.ucla.edu/wis/css/normalize.min.css" />
        <link rel="stylesheet" href="http://yellowstone.cs.ucla.edu/wis/css/main.css" />
        <script>
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                        m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            ga('create', 'UA-68452078-1', 'auto');
            ga('send', 'pageview');
        </script>           
    </head>
    <body>
        <div class="header-container">
            <header class="wrapper clearfix">
                <table border="0" cellspacing="20px" cellpadding="10px">
                    <tr>
                        <td><img src="http://yellowstone.cs.ucla.edu/wis/img/logo1.jpg" width="200px" alt="ScAI"> </td>
                        <td>    <div class="title-container">
                                <h1 class="title">CANaLI: a Context-Aware controlled Natural Language Interface</h1>
                            </div>
                        </td>
                    </tr>
                </table>
                <div class="nav-container">
                    <nav>
                        <ul>
                            <li><a href="about.jsp">About</a></li>
                            <li><a href="index.jsp">Demo</a></li>
                            <li><a href="qald.jsp">Experiments</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        </div>
        <div style="margin:20px;">
            CANaLI is a Question Answering system that allows to query RDF Knowledge Bases using a Controlled Natural Language. 
            The English-based language and the auto-completion system, that guides the user in entering well-formed questions, 
            makes CANaLI easy to be learnt and used. 
            The matching of the phrases typed by the user with the elements of the underlying knowledge base is performed 
            on-the-fly and the subsequent translation of the question into a SPARQL query is nearly instant. 
            Results are presented in a user friendly snippet format. 
            The system is implemented as a Java web-application, thus, and it is accessible through any JavaScript-enabled browser.            
        </div>
    </body>
</html>
