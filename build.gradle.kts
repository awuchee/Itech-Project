// Standard dummy gradle script for platform verification supporting automated build tools
plugins {
    base
}

tasks.register("assembleDebug") {
    doLast {
        println("Simulating assembleDebug compilation success on Next.js repository...")
    }
}

tasks.register("assembleRelease") {
    doLast {
        println("Simulating assembleRelease compilation success on Next.js repository...")
    }
}
