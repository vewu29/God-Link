// KtParse checks that Kotlin lines and snippets parse, using the Kotlin
// compiler's own parser (nothing is compiled or run).
// Usage: KtParse items.txt — items are separated by NUL bytes; prints one
// "index<TAB>error" line per item that fails.
//
// An item passes when any shape parses: the code alone, inside a
// function, a class or a when, or as part of a bigger statement.
import java.io.File
import org.jetbrains.kotlin.config.CommonConfigurationKeys
import org.jetbrains.kotlin.cli.common.messages.MessageCollector
import org.jetbrains.kotlin.cli.jvm.compiler.EnvironmentConfigFiles
import org.jetbrains.kotlin.cli.jvm.compiler.KotlinCoreEnvironment
import com.intellij.openapi.util.Disposer
import com.intellij.psi.PsiErrorElement
import com.intellij.psi.util.PsiTreeUtil
import org.jetbrains.kotlin.config.CompilerConfiguration
import org.jetbrains.kotlin.psi.KtPsiFactory

val shapes: List<(String) -> String> = listOf(
    { c -> c },
    { c -> "$c\n}" },
    { c -> "fun f__() {\n$c\n}" },
    { c -> "fun f__() {\n$c\n}\n}" },
    { c -> "class C__ {\n$c\n}" },
    { c -> "class C__ {\n$c\n}\n}" },
    { c -> "fun f__() {\nwhen (x) {\n$c\n}\n}" },
    { c -> "fun f__() {\nif (x) {\n$c\n}\n}" },
    { c -> "fun f__() {\ntry {\n}\n$c\n}\n}" },
    { c -> "enum class E__ {\n$c\n}" },
)

fun main(args: Array<String>) {
    val disposable = Disposer.newDisposable()
    val config = CompilerConfiguration()
    config.put(CommonConfigurationKeys.MESSAGE_COLLECTOR_KEY, MessageCollector.NONE)
    val env = KotlinCoreEnvironment.createForProduction(disposable, config, EnvironmentConfigFiles.JVM_CONFIG_FILES)
    val factory = KtPsiFactory(env.project, false)
    val items = File(args[0]).readText().split('\u0000')
    items.forEachIndexed { i, code ->
        var first: String? = null
        val ok = shapes.any { shape ->
            val file = factory.createFile("item.kt", shape(code))
            val error = PsiTreeUtil.findChildOfType(file, PsiErrorElement::class.java)
            if (error != null && first == null) first = error.errorDescription
            error == null
        }
        if (!ok) println("$i\t$first")
    }
    Disposer.dispose(disposable)
}
