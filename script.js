const formatos = {
    minima: {
        encabezado: ["timestamp", "minima", "pluviometro", "recorrido"],
        horas: ["07:00"],
        columnas: ["minima", "pluviometro", "recorrido"]
    },

    maxima: {
        encabezado: ["timestamp", "tmx"],
        horas: ["19:00"],
        columnas: ["tmx"]
    },

    psicrometria: {
        encabezado: [
            "timestamp",
            "secos",
            "humedos",
            "termografo",
            "higrografo"
        ],
        horas: ["07:00", "13:00", "18:00"],
        columnas: [
            "secos",
            "humedos",
            "termografo",
            "higrografo"
        ]
    },

    nubosidad: {
        encabezado: [
            "timestamp",
            "nubosidad",
            "fenomenos"
        ],
        horas: ["07:00", "13:00", "19:00"],
        columnas: [
            "nubosidad",
            "fenomenos"
        ]
    },

    pg: {
        encabezado: [
            "timestamp",
            "pg"
        ],
        tipoEspecial: "pg"
    },

    brillo: {
        encabezado: [
            "Dia",
            "brillo"
        ],
        tipoEspecial: "brillo"
    }
}

function crearTextareas(columnas) {

    const contenedor =
        document.getElementById("captura");

    contenedor.innerHTML = "";

    columnas.forEach(nombre => {

        const div =
            document.createElement("div");

        div.innerHTML = `
          <h3>${nombre}</h3>

          <textarea
              id="${nombre}"
              rows="25"
          ></textarea>
      `;

        contenedor.appendChild(div);

    });

}

function generarFormatoSimple(config) {

    const mes =
        Number(document.getElementById("mes").value);

    const anio =
        Number(document.getElementById("anio").value);

    const dias =
        new Date(anio, mes, 0).getDate();

    let csv =
        config.encabezado.join(";") + "\n";

    const columnas =
        config.columnas.map(c =>

            document
                .getElementById(c)
                .value
                .trim()
                .split("\n")
        );

    for (let dia = 1; dia <= dias; dia++) {

        for (let h = 0; h < config.horas.length; h++) {

            const fecha =
                String(dia).padStart(2, "0")
                + "/"
                + String(mes).padStart(2, "0")
                + "/"
                + anio
                + " "
                + config.horas[h];

            const fila = [fecha];

            columnas.forEach(col => {

                const indice =
                    ((dia - 1) * config.horas.length) + h;

                fila.push(col[indice] || "");

            });

            csv += fila.join(";") + "\n";
        }
    }

    return csv;
}

function generarPG() {

    const mes =
        Number(document.getElementById("mes").value);

    const anio =
        Number(document.getElementById("anio").value);

    const valores =
        document.getElementById("pg")
            .value
            .trim()
            .split("\n");

    let csv = "timestamp;pg\n";

    let indice = 0;

    const inicio =
        new Date(anio, mes - 1, 1, 7, 0);

    const fin =
        new Date(anio, mes, 1, 6, 0);

    for (
        let fecha = new Date(inicio);
        fecha <= fin;
        fecha.setHours(fecha.getHours() + 1)
    ) {

        const ts =
            fecha.toLocaleString("es-CO", {
                hour12: false
            })
                .replace(",", "");

        csv +=
            ts + ";" +
            (valores[indice] || "")
            + "\n";

        indice++;
    }

    return csv;
}

function generarBrillo() {

    const mes =
        Number(document.getElementById("mes").value);

    const anio =
        Number(document.getElementById("anio").value);

    const dias =
        new Date(anio, mes, 0).getDate();

    const valores =
        document.getElementById("brillo")
            .value
            .trim()
            .split("\n");

    let csv = "Dia;brillo\n";

    let pos = 0;

    for (let d = 1; d <= dias; d++) {

        for (let h = 5; h <= 18; h++) {

            const fecha =
                String(d).padStart(2, "0")
                + "/"
                + String(mes).padStart(2, "0")
                + "/"
                + anio
                + " "
                + String(h).padStart(2, "0")
                + ":00";

            csv +=
                fecha
                + ";"
                + (valores[pos] || "")
                + "\n";

            pos++;
        }
    }

    return csv;
}

function descargar(nombre, csv) {

    const blob =
        new Blob(
            [csv],
            { type: 'text/csv;charset=utf-8' }
        );

    const a =
        document.createElement('a');

    a.href =
        URL.createObjectURL(blob);

    a.download = nombre;

    a.click();
}