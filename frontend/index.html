package main

import (
        "fmt"
        "html/template"
        "log"
        "net/http"
        "os"
)

func main() {

        log.SetFlags(log.Lshortfile)

        hostList := `{"Go":"http://` + os.Getenv("LEARNING-GO-DEV_IP") + `:` + os.Getenv("LEARNING-GO-DEV_PORT_LISTEN_PORT") + `","Java":"http://` + os.Getenv("LEARNING-JAVA-DEV_IP") + `:` + os.Getenv("LEARNING-JAVA-DEV_PORT_LISTEN_PORT") + `","Python":"http://` + os.Getenv("LEARNING-PY-DEV_IP") + `:` + os.Getenv("LEARNING-PY-DEV_PORT_LISTEN_PORT") + `"}`

        http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

        http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
                tmpl, err := template.ParseFiles("index.html")
                if err != nil {
                        http.Error(w, err.Error(), http.StatusInternalServerError)
                }

                data := struct {
                        HostList string
                }{
                        HostList: hostList,
                }

                err = tmpl.Execute(w, data)
                if err != nil {
                        http.Error(w, err.Error(), http.StatusInternalServerError)
                }
        })
        fmt.Println(":8081")
        fmt.Println(hostList)
        log.Fatalln(http.ListenAndServe(":8081", nil))
}