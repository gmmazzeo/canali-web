<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
        <script type="text/javascript" src="src/canali-tokeninput.js"></script>
        <script type="text/javascript" src="src/buffered-tokens.js"></script>
        <link rel="stylesheet" href="styles/token-input.css" type="text/css" />
        <link rel="stylesheet" href="http://yellowstone.cs.ucla.edu/wis/css/normalize.min.css" />
        <link rel="stylesheet" href="http://yellowstone.cs.ucla.edu/wis/css/main.css" />
        <script type="text/javascript">
            $(document).ready(function () {
                $("#token-input").tokenInput("autocomplete", "query", "results", {});
            });
            function toggle() {
                $(".toggle").toggle("slide");
            }
        </script>
        <style>
            .toggle {
                width: 200px;
                height: 100px;
                position: absolute;                
                top: 0px;
                right: 0px;                
            }            

        </style>
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

    <body style="margin-bottom: 200px;">    
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
        <div style="margin-top:50px; font-size:14px; line-height: 16px; position:relative;">
            <input id="token-input" />
            <div class="toggle"><img src="open-settings.png" onclick="toggle()" width="50px" align="right" title="Open settings"/></div>
            <div class="toggle" style="display: none; width: 300px">
                <div style="float: left; height: 200px"><img src="close-settings.png" onclick="toggle()" width="50px" title="Close settings"/></div>
                <div style="width: 250px; height: 200px; border: 1px; border-color: #8496ba; margin-left: 60px">
                    Endpoint: <input id="endpoint" value="default" title="The sparql end-point url" /><br />
                    <br />
                    Limit: <input id="limit" value="100" title="The maximum number of results" /><br />
                    <br />
                    Context rules disabled <input type="checkbox" id="crdisabled" title="Disable the use of context-based rules in autocompleter" /><br />
                    <br />
                    Auto acceptance disabled <input type="checkbox" id="aadisabled" title="Disable the use of automatic acceptance of tokens" />
                </div>
            </div>
        </div>
        <div style="margin-left: auto; margin-right: auto; margin-top: 100px; font-size: 14px; line-height: 16px" id="results"></div>

    </body>
</html>

