import {useEffect, useState, useMemo} from 'react'
import data from './DatosW/idols.json'
import config from './DatosW/config.json'

type Idol = {
    nombre?: string;
    [key: string]: unknown;
};

type Grupo = {
    grupo: string;
    etiqueta: string;
    orden: number;
    personajes: string[];
};

type Config = {
    grupos: Grupo[];
    despliegue: {
        orden: string[];
        ocultar: string[];
    };
    clasificacion: {
        modo: string;
        nolistados: boolean;
    };
};

const idols = data.idols as Idol[];
const configData = config as Config;

const ETIQUETAS: Record<string, string> = {
    nombre: 'Nombre',
    nombreJap: 'Nombre Japonés',
    descripcion: 'Descripción',
    escuela: 'Escuela',
    grupo: 'Grupo',
    subgrupo: 'Subgrupo',
    año: 'Año',
    edad: 'Edad',
    cumpleaños: 'Cumpleaños',
    sangre: 'Sangre',
    altura: 'Altura',
    comida_favorita: 'Comida Favorita',
    comida_odiada: 'Comida Odiada',
    pasatiempos: 'Pasatiempos'
};

function normalizarNombre(valor: unknown): string {
    return String(valor ?? "")
        .normalize("NFC")
        .trim()
        .toLocaleLowerCase();
}

function despliegue(valor: unknown): string {
    if (valor === null || valor === undefined || valor === "") {
        return "";
    }

    if (Array.isArray(valor)) {
        return valor.map(despliegue)
        .filter(Boolean)
        .join(", ");
    }

    if (typeof valor === "object") {
        return Object.entries(valor as Record<string, unknown>)
            .map(despliegue)
            .filter(Boolean)
            .join(", ");
    }

    if (typeof valor === "boolean") {
        return valor ? "Sí" : "No";
    }

    return String(valor);
}

function obtNomPersonaje(idol: Idol): string {
    return String(idol.nombre ?? "");
}

function obtImgPersonaje(idol: Idol): string {
    const valor = idol["simbolo"];

    if (typeof valor === "string" && valor.trim() !== "") {
        return valor;
    }

    return "";
}

function obtEtq(field: string): string {
    return ETIQUETAS[field] ?? field
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ordPer(personajes: Idol[]): Idol[] {
    const mode = config.clasificacion.modo.toLowerCase();

    if (mode === "alphabetic") {
        return [...personajes].sort((a, b) => 
            obtNomPersonaje(a).localeCompare(obtNomPersonaje(b), "es"));
    }
    return personajes;
}

function obtconfgrups(): Grupo[] {
    const grupos = [...configData.grupos].sort((a, b) => a.orden - b.orden);

    if (!configData.clasificacion.nolistados) {
        return grupos;
    }

    return grupos.map((grupo) => {
        const confNom = new Set(grupo.personajes.map(normalizarNombre));

        const adiNom = idols
            .filter((idol) => normalizarNombre(idol.grupo) === normalizarNombre(grupo.grupo) && !confNom.has(normalizarNombre(idol.nombre)))
            .map(obtNomPersonaje)
            .filter(Boolean);

        return {
            ...grupo,
            personajes: [...grupo.personajes, ...adiNom]
        };
    });
}

export default function Wikia() {
    const grupos = useMemo(() => obtconfgrups(), []);

    const personajesPorGrupo = useMemo(() => {
        return grupos.map((grupo) => {
            const personajes = grupo.personajes
            .map((nomPer) => idols.find((idol) => normalizarNombre(idol.nombre) === normalizarNombre(nomPer)))
            .filter((idol): idol is Idol => Boolean(idol));

            return {...grupo, personajes: ordPer(personajes)};
        });
    }, [grupos]);

    const grupVis = personajesPorGrupo.filter((grupo) => grupo.personajes.length > 0);

    const [actGrupNom, setActGrupNom] = useState(grupVis[0]?.grupo ?? "");

    const actGrup = personajesPorGrupo.find((grupo) => grupo.grupo === actGrupNom) ?? personajesPorGrupo[0];

    const [selecPerNom, setSelecPerNom] = useState(actGrup?.personajes[0]? obtNomPersonaje(actGrup.personajes[0]) : "");

    useEffect(() => {
        if (!actGrup) {setSelecPerNom(""); return;}

        const perExt = actGrup.personajes.some((idol) => normalizarNombre(idol.nombre) === normalizarNombre(selecPerNom));

        if (!perExt) {setSelecPerNom(obtNomPersonaje(actGrup.personajes[0] ?? {}));}
    }, [actGrup, selecPerNom]);

    const selecPer = actGrup?.personajes.find((idol) => normalizarNombre(idol.nombre) === normalizarNombre(selecPerNom)) ?? actGrup?.personajes[0];

    const campOcult = new Set(configData.despliegue.ocultar);

    const campOrd = configData.despliegue.orden.filter((campo) => !campOcult.has(campo));

    const campPer = campOrd
        .filter((campo) => campo !== "nombre")
        .map((campo) => ({
            llave: campo,
            etiqueta: obtEtq(campo),
            valor: selecPer ? despliegue(selecPer[campo]) : ""
        }))
        .filter(({valor}) => valor !== "");

    const imagen = selecPer ? obtImgPersonaje(selecPer) : "";

    function selecGrup(nomGrup: string) {
        const sigGrup = grupVis.find((grupo) => grupo.grupo === nomGrup);

        setActGrupNom(nomGrup);
        setSelecPerNom(sigGrup?.personajes[0] ? obtNomPersonaje(sigGrup.personajes[0]) : "");
    }

    if (grupVis.length === 0 || !selecPer) {
        return (
        <main className="wikia">
            <section className="wikia-nada">
                <p>No hay personajes disponibles.</p>
            </section>
        </main>
        );
    }

    return (
        <main className="wikia">
            <header className="wikia-cabecera">
                <nav className="wikia-grupos">
                    {grupVis.map((grupo) => (
                        <button
                            key={grupo.grupo}
                            type="button"
                            className={`wikia-grupo-button ${actGrup?.grupo === grupo.grupo ? "active" : ""}`}
                            onClick={() => selecGrup(grupo.grupo)}
                        >
                            {grupo.etiqueta}
                        </button>
                    ))}
                </nav>
            </header>
            <section className="wikia-contenido">
                <article className="wikia-personaje" key={String(selecPer.nombre)}>
                    <div className="wikia-personaje-imagen">
                        {imagen ? (
                            <img src={imagen} alt={obtNomPersonaje(selecPer)} loading='lazy'/>
                        ) : (
                            <div className='wikia-personaje-placeholder'>
                                <span>
                                    {obtNomPersonaje(selecPer).slice(0.1)}
                                </span>
                            </div>
                        )}
                        </div>

                        <div className='wikia-personaje-detalles'>
                            <div className='wikia-personaje-titulo'>
                                <span className='wiki-personaje-grupo'>
                                    {actGrup?.etiqueta}
                                </span>
                                <h2>{obtNomPersonaje(selecPer)}</h2>
                                {campOrd.includes("nombreJap") && 
                                    despliegue(selecPer.nombreJap) && (
                                        <p className='wikia-nombre-japo'>
                                            {despliegue(selecPer.nombreJap)}
                                        </p>
                                    )}
                            </div>

                            <div className='wikia-personaje-campos'>
                                {campPer.map ((field) =>(
                                    <section
                                    className={`wikia-campo ${field.llave === "descripcion" ? "wikia-personaje-descripcion" : ""}`}
                                    id={`wikia-campo-${field.llave}`}
                                    key={field.llave}
                                    >
                                        <h3>{field.etiqueta}</h3>
                                        <p>{field.valor}</p>
                                    </section>
                                ))}
                            </div>
                        </div>
                    </article>
                </section>

                <footer className='wikia-personaje-footer'>
                    <div className='wikia-personaje-footer-titulo'>
                        <span>Personajes</span>
                        <span className='wikia-personaje-count'>
                            {actGrup?.personajes.length ?? 0}
                        </span>
                    </div>
                    <nav className="wikia-personaje-lista" aria-label="Seleccionar personaje">
                        {(actGrup?.personajes ?? []).map((idol) => {
                            const nombre = obtNomPersonaje(idol);
                            const siSelecc =
                            normalizarNombre(nombre) === normalizarNombre(selecPer.nombre);
                            const PerImg = typeof idol.simbolo === "string" ? idol.simbolo : "";
                            return (
                            <button
                            className={`wikia-personaje-boton ${siSelecc ? "is-active" : ""}`}
                            key={nombre} type="button"
                            onClick={() => setSelecPerNom(nombre)}
                            aria-pressed={siSelecc} title={nombre}
                            >
                                <span className="wikia-personaje-avatar">
                                    {PerImg ? ( <img src={PerImg} alt="" loading="lazy" />) : (
                                        <span>{nombre.slice(0, 1)}</span>)}
                                </span>
                                <span className="wikia-personaje-nombre">{nombre}</span>
                            </button>
                        );
                    })}
                </nav>
            </footer>
        </main>
    );
}