#include <iostream>  // Incluye las herramientas para mostrar datos en pantalla.
#include <string>    // Incluye el tipo de dato string para trabajar con texto.

using namespace std; // Permite usar cout, string, endl, etc. sin escribir std::.


// ==================================================
// CLASE ARMA
// ==================================================

/**
 * @brief Representa un arma que puede utilizar un personaje.
 */
class Arma // Declara la clase Arma.
{
private: // Todo lo que está debajo solo puede usarse directamente dentro de la clase.

    string nombre; // Guarda el nombre del arma.
    int danio;     // Guarda la cantidad de daño que realiza el arma.

public: // Todo lo que está debajo puede utilizarse desde fuera de la clase.

    /**
     * @brief Constructor de la clase Arma.
     *
     * @param nombre Nombre del arma.
     * @param danio Cantidad de daño que realiza el arma.
     */
    Arma(string nombre, int danio) // Constructor que recibe nombre y daño.
    {
        this->nombre = nombre; // Guarda el parámetro nombre en el atributo nombre.
        this->danio = danio;   // Guarda el parámetro danio en el atributo danio.
    }

    /**
     * @brief Realiza un ataque con el arma.
     */
    void atacar() // Método que no devuelve ningún valor.
    {
        cout << "Ataque con " << nombre // Muestra el nombre del arma.
             << ": " << danio           // Muestra el daño del arma.
             << " puntos de daño"       // Muestra el texto correspondiente.
             << endl;                   // Realiza un salto de línea.
    }

    /**
     * @brief Devuelve el daño del arma.
     *
     * @return Cantidad de daño del arma.
     */
    int getDanio() // Método que devuelve un entero.
    {
        return danio; // Devuelve el valor del atributo danio.
    }

    /**
     * @brief Devuelve el nombre del arma.
     *
     * @return Nombre del arma.
     */
    string getNombre() // Método que devuelve un string.
    {
        return nombre; // Devuelve el nombre del arma.
    }
};


// ==================================================
// CLASE HABILIDAD
// ==================================================

/**
 * @brief Representa una habilidad que puede utilizar un personaje.
 */
class Habilidad // Declara la clase Habilidad.
{
private: // Atributos privados.

    string nombre; // Guarda el nombre de la habilidad.
    int poder;     // Guarda el poder de la habilidad.

public: // Métodos públicos.

    /**
     * @brief Constructor de la clase Habilidad.
     *
     * @param nombre Nombre de la habilidad.
     * @param poder Cantidad de poder de la habilidad.
     */
    Habilidad(string nombre, int poder) // Constructor de Habilidad.
    {
        this->nombre = nombre; // Guarda el nombre recibido.
        this->poder = poder;   // Guarda el poder recibido.
    }

    /**
     * @brief Utiliza la habilidad.
     */
    void usar() // Método que utiliza la habilidad.
    {
        cout << "Se utiliza " << nombre // Muestra el nombre de la habilidad.
             << ": " << poder           // Muestra su poder.
             << " puntos de poder"      // Muestra el texto.
             << endl;                   // Salto de línea.
    }

    /**
     * @brief Devuelve el nombre de la habilidad.
     *
     * @return Nombre de la habilidad.
     */
    string getNombre() // Método que devuelve el nombre.
    {
        return nombre; // Devuelve el atributo nombre.
    }
};


// ==================================================
// CLASE PERSONAJE
// ==================================================

/**
 * @brief Representa un personaje con vida, arma y habilidad.
 */
class Personaje // Declara la clase Personaje.
{
private: // Atributos privados.

    string nombre;        // Guarda el nombre del personaje.
    int vida;             // Guarda la vida del personaje.
    Arma* arma;           // Puntero que apunta a un objeto Arma.
    Habilidad* habilidad; // Puntero que apunta a un objeto Habilidad.

public: // Métodos públicos.

    /**
     * @brief Constructor de la clase Personaje.
     *
     * @param nombre Nombre del personaje.
     * @param vida Vida inicial del personaje.
     * @param arma Puntero al arma del personaje.
     * @param habilidad Puntero a la habilidad del personaje.
     */
    Personaje(
        string nombre,         // Recibe el nombre.
        int vida,              // Recibe la vida.
        Arma* arma,            // Recibe la dirección de un objeto Arma.
        Habilidad* habilidad   // Recibe la dirección de una Habilidad.
    )
    {
        this->nombre = nombre;       // Guarda el nombre recibido.
        this->vida = vida;           // Guarda la vida recibida.
        this->arma = arma;           // Guarda la dirección del arma.
        this->habilidad = habilidad; // Guarda la dirección de la habilidad.
    }

    /**
     * @brief Hace que el personaje ataque con su arma.
     */
    void atacar() // Método de ataque.
    {
        cout << nombre << " ataca:" << endl; // Muestra quién está atacando.

        arma->atacar(); // Accede al objeto apuntado por arma y ejecuta atacar().
    }

    /**
     * @brief Hace que el personaje utilice su habilidad.
     */
    void usarHabilidad() // Método para utilizar la habilidad.
    {
        cout << nombre                            // Muestra el nombre.
             << " utiliza una habilidad:"         // Muestra el mensaje.
             << endl;                             // Salto de línea.

        habilidad->usar(); // Accede a la habilidad mediante el puntero.
    }

    /**
     * @brief Cambia el arma actual del personaje.
     *
     * @param nuevaArma Puntero a la nueva arma.
     */
    void cambiarArma(Arma* nuevaArma) // Recibe la dirección de otra arma.
    {
        arma = nuevaArma; // Hace que arma apunte a la nueva arma.

        cout << nombre                  // Muestra el nombre del personaje.
             << " ahora utiliza "       // Muestra el mensaje.
             << nuevaArma->getNombre()  // Obtiene el nombre de la nueva arma.
             << endl;                   // Salto de línea.
    }

    /**
     * @brief Reduce la vida del personaje.
     *
     * @param danio Cantidad de daño recibido.
     */
    void recibirDanio(int danio) // Recibe el daño como parámetro.
    {
        vida -= danio; // Resta el daño a la vida actual.

        cout << nombre                   // Muestra el personaje.
             << " recibio "              // Muestra el texto.
             << danio                    // Muestra el daño recibido.
             << " puntos de daño."       // Muestra el texto.
             << endl;                    // Salto de línea.

        cout << "Vida restante: "        // Muestra el texto.
             << vida                     // Muestra la vida actual.
             << endl;                    // Salto de línea.
    }
};


// ==================================================
// FUNCIÓN PRINCIPAL
// ==================================================

/**
 * @brief Función principal del programa.
 *
 * @return 0 si el programa termina correctamente.
 */
int main() // Punto inicial del programa.
{
    // Crea un objeto Arma en memoria dinámica.
    Arma* espada = new Arma("Espada de fuego", 30);
    // espada es un puntero que guarda la dirección del objeto creado.

    // Crea otra arma en memoria dinámica.
    Arma* arco = new Arma("Arco magico", 20);
    // arco guarda la dirección del objeto Arma.

    // Crea una habilidad en memoria dinámica.
    Habilidad* curacion = new Habilidad("Curacion", 25);
    // curacion apunta al objeto Habilidad.

    // Crea otra habilidad en memoria dinámica.
    Habilidad* escudo = new Habilidad("Escudo magico", 15);
    // escudo apunta a otra Habilidad.

    // Crea un personaje en memoria dinámica.
    Personaje* guerrero =
        new Personaje("Guerrero", 100, espada, curacion);
    // guerrero guarda la dirección del Personaje.
    // El personaje recibe los punteros espada y curacion.

    guerrero->atacar();
    // Accede al objeto guerrero y ejecuta atacar().

    guerrero->usarHabilidad();
    // Ejecuta la habilidad del guerrero.

    guerrero->recibirDanio(20);
    // Resta 20 puntos a la vida del guerrero.

    guerrero->cambiarArma(arco);
    // Hace que el guerrero ahora utilice el arco.

    guerrero->atacar();
    // El guerrero ataca con el arco.

    // Crea otro personaje dinámicamente.
    Personaje* arquero =
        new Personaje("Arquero", 80, arco, escudo);
    // El arquero utiliza el mismo objeto arco.

    arquero->atacar();
    // El arquero realiza un ataque.

    arquero->usarHabilidad();
    // El arquero utiliza el escudo mágico.

    delete guerrero;
    // Libera la memoria reservada para guerrero.

    delete arquero;
    // Libera la memoria reservada para arquero.

    delete espada;
    // Libera la memoria reservada para espada.

    delete arco;
    // Libera la memoria reservada para arco.

    delete curacion;
    // Libera la memoria reservada para curacion.

    delete escudo;
    // Libera la memoria reservada para escudo.

    return 0;
    // Indica que el programa terminó correctamente.
}